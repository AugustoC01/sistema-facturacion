// fubnction to filter empty fields on update
export const filterEmptyFields = (data, allowedFields) => {
  const filteredData = {}
  allowedFields.forEach((field) => {
    if (data[field]) {
      filteredData[field] = data[field]
    }
  })
  return filteredData
}
