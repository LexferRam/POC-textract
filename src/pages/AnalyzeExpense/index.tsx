import { useState, useRef } from "react";
import {
  TextractClient,
  AnalyzeExpenseCommand,
  AnalyzeExpenseCommandInput,
  AnalyzeExpenseCommandOutput,
} from "@aws-sdk/client-textract";
import styles from "../../app/page.module.css";
import { redirect } from "../../utils/router.functions";
import "../pages.css";

interface ImageSch {
  uri: string;
  file: File;
  bufferArray: ArrayBuffer;
}

interface FormattedResult {
  label: string | null;
  value: string | number;
  type: string;
}

export default function AnalyzeExpense() {
  const [image, setImage] = useState<ImageSch | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<FormattedResult[] | null>(null);

  const inputFile = useRef<HTMLInputElement | null>(null);

  const client = new TextractClient({
    region: "us-east-1",
    credentials: {
      accessKeyId: process.env.GOOGLE_CLIENT_ID || '' ,
      secretAccessKey: process.env.NEXT_PUBLIC_SECRET || ''
    },
  });

  const input: AnalyzeExpenseCommandInput = {
    Document: {
      // Document
      Bytes: image?.bufferArray
        ? new Uint8Array(image?.bufferArray)
        : undefined, // e.g. Buffer.from("") or new TextEncoder().encode("")
    },
  };

  const sendCommand = async () => {
    try {
      setLoading(true);

      const command = new AnalyzeExpenseCommand(input);
      const response: AnalyzeExpenseCommandOutput = await client.send(command);

      if (response) {
        setLoading(false);
        let finalResult: FormattedResult[] = [];

        response.ExpenseDocuments?.map((docs) => {
          docs.SummaryFields?.map((fields) => {
            finalResult.push({
              label: fields.LabelDetection?.Text ?? null,
              value: fields.ValueDetection?.Text ?? "No encontrado",
              type: fields.Type?.Text ?? "No encontrado",
            });
          });
        });

        if (finalResult?.length > 0) setResult(finalResult);

        console.log("response: ", response);
      } else {
        console.log("Something went wrong in analyze");
      }
    } catch (error) {
      setLoading(false);
      console.log("Analyzed err:", error);
      alert("Ha ocurrido un error");
    }
  };

  const onButtonClick = () => {
    inputFile?.current?.click();
  };

  const handleImageChange = async (file: File | null) => {
    if (file) {
      setImage({
        ...image,
        uri: URL.createObjectURL(file),
        file: file,
        bufferArray: await file.arrayBuffer(),
      });
    }
  };

  return (
    <div className={styles.main} style={{ display: "flex", gap: "20px" }}>
      <h1>Análisis de Facturas</h1>
      <div
        style={{
          display: "flex",
          flexWrap: "nowrap",
          gap: "20px",
        }}
      >
        {image ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              gap: "20px",
              border: "3px solid white",
              borderRadius: "8px",
              minHeight: "400px",
              maxHeight: "600px",
              padding: "25px",
            }}
          >
            {image.file.type.includes("pdf") ? (
              <iframe src={image.uri}></iframe>
            ) : (
              <img
                src={image.uri}
                style={{ maxWidth: "300px", maxHeight: "300px" }}
              />
            )}
            <h4>{image?.file.name}</h4>
          </div>
        ) : null}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            minHeight: "400px",
            maxHeight: "600px",
            gap: "20px",
            border: "3px solid white",
            borderRadius: "8px",
            padding: "25px",
          }}
        >
          <input
            ref={inputFile}
            style={{ display: "none" }}
            type="file"
            id="img-input"
            accept=".png, .jpg, .jpeg, .pdf"
            onChange={(e) =>
              handleImageChange(e.target.files ? e.target.files[0] : null)
            }
          />
          <button className="general-btn" onClick={onButtonClick}>
            Seleccionar imagen
          </button>

          {image ? (
            <button
              className="general-btn"
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
              onClick={sendCommand}
            >
              {loading ? (
                <div
                  className="rotate"
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    borderColor: "white",
                    borderWidth: "2px",
                    borderStyle: "outset",
                  }}
                />
              ) : (
                "Analizar"
              )}
            </button>
          ) : null}
        </div>
      </div>
      {result ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexWrap: "wrap",
            width: "100%",
            border: "2px solid white",
            borderRadius: "8px",
            gap: "10px",
            padding: "15px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "start",
              flexWrap: "wrap",
              gap: "10px",
            }}
          >
            {result.map((res, index) => {
              return (
                <div
                  key={`data-doc-${index}`}
                  style={{
                    flex: 1,
                    height: "auto",
                    padding: "15px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <h4 className="paragraph-result typer">Tipo: </h4>
                  <p className="paragraph-result">"{res.type}"</p>
                  {res.label ? (
                    <>
                      <h4 className="paragraph-result labelr">Label: </h4>
                      <p className="paragraph-result">"{res.label}"</p>
                    </>
                  ) : null}
                  <h4 className="paragraph-result valuer">Valor: </h4>
                  <p className="paragraph-result">"{res.value}"</p>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}
      <button
        onClick={() => redirect("/")}
        className="general-btn"
        style={{
          width: "20%",
          minWidth: "100px",
          maxWidth: "300px",
          position: "fixed",
          bottom: 0,
          right: 0,
          marginRight: "25px",
          marginBottom: "2%",
        }}
      >
        Ir al inicio
      </button>
    </div>
  );
}
