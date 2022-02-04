export const EXCEL_TEMPLATE = {
  PATIENT_IMPORT: process.env.VUE_APP_BASE_IMAGE + '/source/muban/受试者模板.xlsx',
	USER_IMPORT: process.env.VUE_APP_BASE_IMAGE + '/source/muban/用户导入模板.xlsx',
  DEPARTMENTS: process.env.VUE_APP_BASE_IMAGE + '/source/muban/科室字典.xlsx',
  ACCOUNT_VISIBLE: process.env.VUE_APP_BASE_IMAGE + '/source/muban/账户可见范围.xls'
}

export default {
	EXCEL_TEMPLATE
}
