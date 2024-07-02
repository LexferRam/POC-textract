
import { useState, useRef, FC } from "react";
import {
  TextractClient,
  AnalyzeDocumentCommand,
  AnalyzeDocumentCommandInput,
  AnalyzeDocumentCommandOutput,
} from "@aws-sdk/client-textract";
import styles from "../../app/page.module.css";
import getDocumentQueries, { calculateAge } from "../../utils/getDocumentQueries";
import { redirect } from "../../utils/router.functions";
import { maxPercentTolerant } from "../../constants/keyValues";
import Image from "next/image";
import "../pages.css";
import axios from "axios";
import { CAR_BRANDS, CARS_MODELS, CARS_VERSIONS } from "@/constants/carBrands";
import { useRouter } from "next/router";
import { Button, Card, MenuItem, TextField } from "@mui/material";
import LoadingButton from '@mui/lab/LoadingButton';
import PageviewIcon from '@mui/icons-material/Pageview';
import { quotesTypes } from "@/constants/quotesTypes";
import { useForm } from "react-hook-form";

interface ImageSch {
  uri: string;
  file: File;
  bufferArray: ArrayBuffer;
}

interface analyzedResult {
  key: string;
  value: string;
  confidence?: number;
}

interface checkIconFc {
  check: boolean;
}

export default function AnalyzeDocument() {

  const { register, handleSubmit } = useForm();

  const [image, setImage] = useState<ImageSch | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedDocType, setSelectedDocTyoe] = useState<string>("");
  const [result, setResult] = useState<analyzedResult[] | null>(null);
  const [resultConfidence, setResultConfidence] = useState<string | null>(null);
  const [generalConfidence, setGeneralConfidence] = useState<string | null>(
    null
  );
  const inputFile = useRef<HTMLInputElement | null>(null);
  const router = useRouter()

  const client = new TextractClient({
    region: "us-east-1",
    credentials: {
      accessKeyId: process.env.NEXT_PUBLIC_ACCESS_KEY || '',
      secretAccessKey: process.env.NEXT_PUBLIC_SECRET || '',
    },
  });

  const input: AnalyzeDocumentCommandInput = {
    // AnalyzeDocumentRequest
    Document: {
      // Document
      Bytes: image?.bufferArray
        ? new Uint8Array(image?.bufferArray)
        : undefined, // e.g. Buffer.from("") or new TextEncoder().encode("")
    },
    FeatureTypes: [
      // FeatureTypes // required
      "QUERIES",
      "TABLES",
    ],
    QueriesConfig: {
      // QueriesConfig
      Queries: getDocumentQueries(selectedDocType),
    },
  };

  const onSubmit = async (dataForm: any) => {
    console.log(dataForm.quotationType)

    try {
      setResult(null);
      setLoading(true);

      const command = new AnalyzeDocumentCommand(input);
      const response: AnalyzeDocumentCommandOutput = await client.send(command);

      if (response) {
        const data: analyzedResult[] = [];

        const blocks = response.Blocks;

        console.log(blocks?.filter((query) => query.BlockType === "LINE")?.map(item => item.Text))

        const regex = /^[V][0-9]{8,9}$/;

        const hasValidFormat = (str: any) => {
          return regex.test(str) && str;
        } 

        const lineBlockType = blocks?.filter((query) => query.BlockType === "LINE")

        const identificationId = lineBlockType?.map((item) => hasValidFormat(item.Text)).filter(Boolean)[0]

        console.log(identificationId)

        const arrayTextLines = lineBlockType?.map((item) => item.Text) || []

        const identificationIdIndex = arrayTextLines.indexOf(identificationId);
        console.log(identificationIdIndex)

        const secondIndex = arrayTextLines || []
        const name = identificationIdIndex && secondIndex[identificationIdIndex - 1]
        const vehicleYear: any = identificationIdIndex && secondIndex[identificationIdIndex + 3]

        const queriesLines = blocks
        ? lineBlockType?.map(item => item.Text)
        : null;

        const carBrandCode = queriesLines?.map(item => {
          if (!item) return
          if (CAR_BRANDS[item] !== undefined) return CAR_BRANDS[item]
        }).filter(Boolean)[0]

        const queries = blocks
          ? blocks?.filter((query) => query.BlockType === "QUERY")
          : null;
        const queriesResult = blocks
          ? blocks?.filter((query) => query.BlockType === "QUERY_RESULT")
          : null;

        if (queries && queriesResult) {
          const docKeysLength = getDocumentQueries(selectedDocType)?.length;
          const keysConfidence = docKeysLength
            ? (queriesResult.length / docKeysLength) * 100
            : 0;
          const generalConfidenceValues: number[] = [];
          queries?.map((query) => {
            let id =
              query.Relationships && query.Relationships[0].Ids
                ? query?.Relationships[0]?.Ids[0]
                : null;
            let found = queriesResult?.find((result) => result.Id === id);

            if (found && query.Query?.Alias && found.Text) {
              generalConfidenceValues.push(found?.Confidence ?? 0);
              data.push({
                key: query?.Query?.Alias,
                value: found?.Text,
                confidence: found?.Confidence,
              });
            }
          });

          let resultQueryObj: any = {}

          console.log(data);

          data.forEach(item => {
            resultQueryObj={
              ...resultQueryObj,
              [item.key]: item.value
            }
          })

          console.log(resultQueryObj)

          let bodyRequestAuto = {
            p_json_info: JSON.stringify({
              p_applicant_email: 'lexferramirez@gmail.com',
              p_year: vehicleYear,//parseInt(vehicleYear), // !
              p_mark: carBrandCode,         //!
              p_model: CARS_MODELS[carBrandCode]?.VALOR, //!
              p_version: CARS_VERSIONS[carBrandCode]?.VALOR,//!
              p_applicant_name: name, //!
              p_applicant_phone_number:"04142023161",
              p_partner_code:"7412",
              p_codprod:"AUTO",
              p_alianza: "J29415"
            })
          }

          console.log(bodyRequestAuto)

          let bodyRequestHealth = {
            p_json_info: JSON.stringify({
              p_applicant_email: "lexferramirez@gmail.com",
              p_ages_titu: dataForm.quotationType === 'ci' && String(calculateAge(resultQueryObj['F de nacimiento'])) || '', //!
              p_applicant_name: resultQueryObj?.Nombres+' '+resultQueryObj?.Apellidos, //!
              p_applicant_phone_number: "04142023161",
              p_all_ages: dataForm.quotationType === 'ci' && String(calculateAge(resultQueryObj['F de nacimiento'])) || '', //!
              p_codprod: "VIDA",
              p_partner_code: "21605",
              p_alianza: "J107017"
            })
          }

          let responseQuote: any

          if(selectedDocType === 'cc'){
            responseQuote = await axios.post(
              'https://asesoresoc.oceanicadeseguros.com/asg-api/dbo/budgets/generate_budget_home',
              bodyRequestAuto
            )
          } else {
            responseQuote = await axios.post(
              'https://asesoresoc.oceanicadeseguros.com/asg-api/dbo/budgets/generate_budget_per_massive',
              bodyRequestHealth
            )
          }


          const budgetID = responseQuote.data.p_budget_id
          router.push(`/BudgetPlans/${budgetID}`)

          const prom =
            generalConfidenceValues.reduce((a, b) => a + b, 0) /
            generalConfidenceValues.length;

          setResult(data);
          setResultConfidence(
            keysConfidence ? keysConfidence.toFixed(2) : null
          );
          setGeneralConfidence(prom ? prom.toFixed(2) : null);
        }

        setLoading(false);
        console.log(response);
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

  const CheckIcon: FC<checkIconFc> = ({ check }) => {
    return (
      <Image
        src={check ? "/check-icon.svg" : "/cross-icon.svg"}
        alt="check"
        width={24}
        height={24}
        priority
      />
    );
  };

  return (
    <div style={{ display: "flex", justifyContent: "space-evenly", flexWrap: 'wrap' }}>
      <h1>Análisis de documentos</h1>
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
              <iframe src={image.uri} />
            ) : (
              <img
                src={image.uri}
                style={{ maxWidth: "90%", maxHeight: "90%" }}
              />
            )}
            <h4>{image?.file.name}</h4>
          </div>
        ) : null}
        <form onSubmit={handleSubmit(onSubmit)}>
          <Card
            elevation={10}
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
            <h3>Cotización {selectedDocType === '' ? '': (selectedDocType === 'cc' ? 'auto': 'salud') }</h3>

            <TextField
              select
              {...register("quotationType")}
              label="Seleccione el tipo de cotización"
              fullWidth
              value={selectedDocType}
              onChange={(e) => setSelectedDocTyoe(e.target.value)}
              sx={{
                minWidth: '400px'
              }}
            >
              {quotesTypes.map((option) => {
                return (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                )
              })}
            </TextField>

            {selectedDocType !== "" ? (
              <>
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
                <Button
                  style={{
                    borderRadius: '30px',
                    backgroundColor: 'rgb(71, 192, 182)',
                    padding: '12px 30px',
                    fontSize: '12px',
                    color: 'white',
                    boxShadow: 'rgba(71, 192, 182, 0.14) 0px 2px 2px 0px, rgba(71, 192, 182, 0.2) 0px 3px 1px -2px, rgba(71, 192, 182, 0.12) 0px 1px 5px 0px',
                    outline: '0px',
                    border: '0px',
                    fontWeight: 500
                  }} onClick={onButtonClick}>
                  Seleccionar imagen
                </Button>
              </>
            ) : null}

            {image && selectedDocType !== "" ? (
              <>
                <LoadingButton
                  // onClick={onSubmit}
                  type="submit"
                  style={{
                    borderRadius: '30px',
                    backgroundColor: 'rgb(71, 192, 182)',
                    padding: '12px 30px',
                    fontSize: '12px',
                    color: 'white',
                    boxShadow: 'rgba(71, 192, 182, 0.14) 0px 2px 2px 0px, rgba(71, 192, 182, 0.2) 0px 3px 1px -2px, rgba(71, 192, 182, 0.12) 0px 1px 5px 0px',
                    outline: '0px',
                    border: '0px',
                    fontWeight: 500
                  }}
                  loading={loading}
                  loadingPosition="start"
                  startIcon={<PageviewIcon />}
                  variant="outlined"
                >
                  Analizar
                </LoadingButton>
              </>
            ) : null}
          </Card>
        </form>
      </div>
    </div>
  );
}
