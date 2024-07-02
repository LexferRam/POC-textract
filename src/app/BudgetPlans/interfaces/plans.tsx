export interface Plans {
    plan_id:           number;
    codprod:           Codprod;
    codplan:           Codplan;
    revplan:           string;
    descplanprod:      string;
    codofi:            string;
    stsplan:           Stsplan;
    tipovig:           string;
    formpago:          string;
    indsumaaseg:       Indpago;
    indpago:           Indpago;
    codmoneda:         Codmoneda;
    tipo_plan:         number;
    descrip_tipo_plan: string;
    coberturas:        Cobertura[];
    bienes:            any[];
    sumaaseg:          number;
    prima:             number;
    fraccionamiento:   Fraccionamiento[];
}

export interface Cobertura {
    cobert_id:      number;
    codprod:        Codprod;
    codplan:        Codplan;
    revplan:        string;
    codramocert:    Codramocert;
    codcobert:      string;
    desccobert:     string;
    codmoneda:      Codmoneda;
    suma_aseg:      number;
    tasa:           number;
    prima:          number;
    mtodeducible:   number;
    porcreemb:      number;
    porcdeducible:  number;
    baseded:        Indpago;
    indsumaded:     Stsplan;
    indincluida:    Indpago;
    indcobertoblig: Indpago;
    indvisible:     Indpago;
    permite_aseg:   number;
    orden:          number | null;
}

export enum Indpago {
    S = "S",
}

export enum Codmoneda {
    DL = "DL",
}

export enum Codplan {
    Dl1 = "DL1",
}

export enum Codprod {
    Auto = "AUTO",
}

export enum Codramocert {
    Auap = "AUAP",
    Aurc = "AURC",
}

export enum Stsplan {
    N = "N",
}

export interface Fraccionamiento {
    ideplan:          number;
    nomplan:          string;
    porini:           number;
    porinimin:        number;
    porinimax:        number;
    numfracc:         number;
    codfracc:         string;
    codmoneda:        Codmoneda;
    porcinicial:      number;
    cantgiros:        number;
    mtototinicial:    number;
    mtogirolocal:     number;
    mtoprestamolocal: number;
    prima:            number;
    maxgiro:          number;
    mingiro:          number;
}
