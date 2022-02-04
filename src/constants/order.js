// 支付类型 1 支付宝支付 2 微信支付 3 余额支付
export const PAY_TYPE = {
	Coin: {
		value: 3,
		desc: '余额支付'
	},
	WxPay: {
		value: 2,
		desc: '微信支付'
	},
	Alipay: {
		value: 1,
		desc: '支付宝支付'
	}
}

export default {
	PAY_TYPE
}
