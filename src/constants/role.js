// 判断当前用户角色： if (this.$options.filters.isHasAuth(this.$const.ROLE_TYPE.CRC.value))
export const ROLE_TYPE = {
	ADMIN: {
		value: 'SYS_ADMIN',
		desc: '超级管理员'
	},
	YW_ADMIN: {
		value: 'SYS_BIZ',
		desc: '业务管理员'
  },
  PM: {
		value: 'PM',
		desc: 'PM'
  },
  CRA: {
		value: 'CRA',
		desc: 'CRA'
  },
  CRC: {
		value: 'CRC',
		desc: 'CRC'
  },
  PI: {
		value: 'PI',
		desc: 'PI'
	}
}

export const SYSTEM_TYPE = {
	EPAYMENT: {
		value: 1,
		desc: 'EPAYMENT'
	},
	ECONSENT: {
		value: 2,
		desc: 'ECONSENT'
	},
	ESOURCE: {
		value: 3,
		desc: 'ESOURCE'
	}
}

export default {
	ROLE_TYPE,
	SYSTEM_TYPE
}
