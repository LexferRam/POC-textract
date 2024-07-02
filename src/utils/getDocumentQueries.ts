import { Query } from "@aws-sdk/client-textract";
import {
  venezuelanIdQueries,
  venezuelanCirculationCertificateQueries,
  InvoiceQueries,
} from "../constants/documentQueries";

interface returnType {
  [key: string]: Query[];
}

export default function getDocumentQueries(type: string): Query[] | undefined {
  const types: returnType = {
    ci: venezuelanIdQueries,
    cc: venezuelanCirculationCertificateQueries,
    inv: InvoiceQueries,
  };

  return types[type] ?? undefined;
}


export function calculateAge(dateOfBirth: string): number {
  // Split the date string into day, month, and year components
  const [dayString, monthString, yearString] = dateOfBirth?.split("/");

  // Parse the components into numbers
  const day = parseInt(dayString);
  const month = parseInt(monthString) - 1; // Months are 0-indexed in JavaScript
  const year = parseInt(yearString);

  // Get the current date
  const today = new Date();

  // Create a Date object from the birth date
  const birthDate = new Date(year, month, day);

  // Calculate the age in years
  let age = today?.getFullYear() - birthDate?.getFullYear();

  // Adjust the age if the birthday hasn't happened this year yet
  if (today?.getMonth() < birthDate?.getMonth() ||
      (today?.getMonth() === birthDate?.getMonth() && today?.getDate() < birthDate?.getDate())) {
    age--;
  }

  return age;
}