export function converterDataBrasileiraParaDataIso(dataBrasileira: string): string {
    if (dataBrasileira.includes("-")) {
        return dataBrasileira;
    }

    const [dia, mes, ano] = dataBrasileira.split("/");
    return [ano, mes, dia].join("-");
}