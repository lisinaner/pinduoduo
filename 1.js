const axios = require('axios');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

let data = '{"type":"unreceived","page":1,"page_from":0,"size":50,"offset":"230626-094146477680931"}';

let config = {
  method: 'post',
  maxBodyLength: Infinity,
  url: 'https://mobile.yangkeduo.com/proxy/api/api/aristotle/order_list_v3?pdduid=5159746503587',
  headers: { 
    'accesstoken': '457GE4IGCJXTFJZRQKBYH6HYRPU4MA2JIRQQJPXSCESC4CP6EYOQ123a3b0', 
    'Content-Type': 'text/plain', 
    // 'Cookie': 'api_uid=CinGXWSnC1V7NQBc9ku2Ag=='
  },
  data : data
};
let orderSn=[]
axios.request(config)
.then((response) => {
	
//   console.log(response.data.orders.length);
  response.data.orders.forEach(element => {
	orderSn.push(element.order_sn)
	
  });
  console.log(orderSn)
}).then(()=>{
	orderSn.forEach(element => {
		let config = {
			method: 'get',
			maxBodyLength: Infinity,
			url: 'https://mobile.yangkeduo.com/goods_express.html?order_sn='+element,
			headers: { 
			  'cookie': 'PDDAccessToken=457GE4IGCJXTFJZRQKBYH6HYRPU4MA2JIRQQJPXSCESC4CP6EYOQ123a3b0;'
			}
		  };
		  
		  axios.request(config)
		  .then((response) => {
			let data=response.data
			// console.log(JSON.stringify(response.data));
			// let text = document.querySelector('.address-text').innerText;
			let dom = new JSDOM(data);
			let text1 = dom.window.document.querySelector('.address-text')?.textContent;
			let text2 = dom.window.document.querySelector('.order-sn')?.textContent;
			let text3=dom.window.document.querySelector('.express-info')?.textContent;
			console.log({
				text1,text2,text3
			});
		
		  })
		  .catch((error) => {
			console.log(error);
		  });
		  
	})
})
.catch((error) => {
  console.log(error);
});
