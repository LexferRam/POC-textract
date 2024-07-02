'use client'

import { Button, Paper } from "@mui/material"
import { redirect, useParams } from "next/navigation"
import { Plans, Fraccionamiento } from '../interfaces/plans';
import { useBudgetById } from "../hooks"
import SkeletonCards from "../_components/SkeletonCards";
import CallIcon from '@mui/icons-material/Call';
import AppsIcon from '@mui/icons-material/Apps';
import DirectionsCarFilledIcon from '@mui/icons-material/DirectionsCarFilled';
import PersonIcon from '@mui/icons-material/Person';
import { CAR_BRANDS, CAR_BRANDS_DESCRIPTION, CARS_MODELS } from "@/constants/carBrands";

const paymentTypes = {
  "Semestral": "Semestral",
}

export default function BudgetPlans() {

  const params = useParams<{ budgetID: string }>()

  const { isPending, error, data } = useBudgetById(params)
  if (isPending) return <SkeletonCards />
  console.log(data)

  console.log(data?.data.p_cur_budget[0]?.AREA_NAME) //AUTOMOVIL

  const areaName = data?.data.p_cur_budget[0]?.AREA_NAME

  return (

    <Paper
      elevation={10}
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'start',
        alignItems: 'center',
        width: '98%',
        padding: '15px 10px',
        paddingBottom: '80px',
        height: '100vh',
        margin: '13px'
      }}
    >

      <div
        style={{
          color: 'rgb(60, 72, 88)',
          textDecoration: 'none',
          fontWeight: 600,
          marginTop: '30px',
          marginBottom: '25px',
          minHeight: '32px',
          textAlign: 'center',
          fontSize: '26px'
        }}
      >Cotización de {areaName ==='AUTOMOVIL' ? 'auto': 'salud'}</div>

      <div
        style={{
          margin: '10px',
          display: 'flex',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}
      >

        <div
          style={{
            margin: '10px',
            color: 'rgb(71, 192, 182)',
            display: 'flex',
            gap: '4px',
            alignItems: 'center',
            fontSize: '13px'
          }}
        >
          <AppsIcon />
          <span
            style={{
              color: 'rgb(60, 72, 88)',
              fontWeight: 700
            }}
          >
            Cotización: {data?.data?.p_cur_budget[0].BUDGET_ID || ''}
          </span>
        </div>

        <div
          style={{
            margin: '10px',
            color: 'rgb(71, 192, 182)',
            display: 'flex',
            gap: '4px',
            alignItems: 'center',
            fontSize: '13px'
          }}
        >
          <CallIcon />
          <span
            style={{
              color: 'rgb(60, 72, 88)',
              fontWeight: 700
            }}
          >
            {data?.data?.p_cur_budget[0].APPLICANT_NAME || ''}
          </span>
        </div>

        <div
          style={{
            margin: '10px',
            color: 'rgb(71, 192, 182)',
            display: 'flex',
            gap: '4px',
            alignItems: 'center',
            fontSize: '13px'
          }}
        >
          {areaName ==='AUTOMOVIL' ? <DirectionsCarFilledIcon /> : <PersonIcon />}
          <span
            style={{
              color: 'rgb(60, 72, 88)',
              fontWeight: 700
            }}
          >
            {areaName ==='AUTOMOVIL'  ? CAR_BRANDS_DESCRIPTION[data?.data?.p_budget_info.p_mark]: data?.data.p_budget_info.p_ages_titu}
            </span>
            <span
            style={{
              color: 'rgb(60, 72, 88)',
              fontWeight: 700
            }}
          >
            {areaName ==='AUTOMOVIL'  ? CARS_MODELS[data?.data?.p_budget_info.p_mark].DESCRIP : ''}
          </span>
        </div>

      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '30px',
        marginTop:'30px',
      }}>
        {data?.data.p_budget_plans.plans?.map((plan: Plans) => (
          <Paper
            key={plan.plan_id}
            style={{
              width: '298px',
              height: '300px',
              paddingBottom: '10px'
            }}
            elevation={20}
          >
            <div
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-around',
                alignItems: 'center',
              }}
            >
              <h6
                style={{
                  color: 'rgb(153, 153, 153)',
                  textTransform: 'uppercase',
                  fontWeight: '400',
                  textAlign: 'center',
                  marginLeft: '32px',
                  marginRight: '32px',
                  marginBottom: '0px',
                  marginTop: '0px',
                  fontSize: '15px'
                }}
              >
                {plan.descplanprod}
              </h6>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >

                <div>
                  <p
                    style={{
                      color: 'rgb(153, 153, 153)',
                      textTransform: 'capitalize',
                      fontSize: '58%',
                      margin: '2px',
                      textAlign: 'center'
                    }}
                  >$ <span
                    style={{
                      textTransform: 'uppercase',
                      fontSize: '1.8em',
                      color: 'rgb(60, 72, 88)',
                      fontWeight: '600'
                    }}
                  >{plan.sumaaseg}</span>/Anual</p>
                </div>

                {plan.fraccionamiento.map(fraccionamiento => (
                  <div key={fraccionamiento.codfracc}>
                    <p
                      style={{
                        color: 'rgb(153, 153, 153)',
                        textTransform: 'capitalize',
                        fontSize: '58%',
                        margin: '2px'
                      }}
                    >$ <span
                      style={{
                        textTransform: 'uppercase',
                        fontSize: '1.8em',
                        color: 'rgb(60, 72, 88)',
                        fontWeight: '600'
                      }}
                    >{fraccionamiento.prima}</span> / {fraccionamiento.nomplan}</p>
                  </div>
                ))}

              </div>

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
                }}
                variant="outlined">
                comprar
              </Button>

            </div>
          </Paper>
        ))}
      </div>
    </Paper>
  )
}
