export const FormatDateToString = (dateObject) => {
    return dateObject?.toISOString().split("T")[0]
}