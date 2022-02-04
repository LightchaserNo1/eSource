// 定义使用状态
export const USE_STATUS = {
  Active: {
    value: 0,
    desc: '禁用',
    status: 0,
    color: '#FF201A'
  },
  UnActive: {
    value: 1,
    desc: '使用',
    status: 1,
    color: '#20D86E'
  }
}

export const USER_TYPE = {
	GEREN: {
		value: 1,
		desc: '个人',
		color: 'F50'
	},
	ZUZHI: {
		value: 2,
		desc: '组织'
	}
}

export const ROLE_TYPE = {
	ADMIN: {
		value: 1,
		desc: '超级管理员'
	},
	YW_ADMIN: {
		value: 2,
		desc: '业务管理员'
  },
  PM: {
		value: 3,
		desc: '项目管理'
  },
  CRA: {
		value: 4,
		desc: 'CRA'
  },
  CRC: {
		value: 5,
		desc: 'CRC'
  },
  PI: {
		value: 6,
		desc: 'PI'
	}
}

export default { USE_STATUS, USER_TYPE, ROLE_TYPE }
