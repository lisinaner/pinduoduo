const axios = require('axios');
const jsdom = require("jsdom");
const express=require('express')
const { JSDOM } = jsdom;
const app = express()
const port = 3000

app.use(express.static('public'))
app.get('/a', (req, res) => {
	let pwd=req.query.pwd
	let start=req.query.start
	let outputArr=[]
	let data = {"type":"unreceived","page":1,"page_from":0,"size":50,"offset":start};

	let config = {
	  method: 'post',
	  maxBodyLength: Infinity,
	  url: 'https://mobile.yangkeduo.com/proxy/api/api/aristotle/order_list_v3?pdduid=5159746503587',
	  headers: { 
		'accesstoken': pwd, 
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
	}).then(async()=>{
		await Promise.all(orderSn.map(async (element) => {
			 	let config = {
				method: 'get',
				maxBodyLength: Infinity,
				url: 'https://mobile.yangkeduo.com/goods_express.html?order_sn='+element,
				headers: { 
				  'cookie': 'PDDAccessToken='+pwd+";"
				}
			  };
			  
			  await  axios.request(config)
			  .then(async(response) => {
				let data=response.data
				// console.log(JSON.stringify(response.data));
				// let text = document.querySelector('.address-text').innerText;
				let dom = new JSDOM(data);
				let text1 = dom.window.document.querySelector('.address-text')?.textContent;
				let text2 = dom.window.document.querySelector('.order-sn')?.textContent.replace(/订单编号:/g, "");
				let text3=dom.window.document.querySelector('.express-info')?.textContent.replace(/复制/g, "");;
				//获取订单
				// _3GeQUL0R
				let config = {
					method: 'get',
					maxBodyLength: Infinity,
					url: 'https://mobile.yangkeduo.com/order.html?order_sn='+element,
					headers: { 
						'cookie': 'PDDAccessToken='+pwd+";"
					}
				  };
				  
				 await axios.request(config)
				  .then((response) => {
					let data=response.data
					let dom = new JSDOM(data);
					let text4=dom.window.document.querySelector('._3GeQUL0R')?.textContent;
					outputArr.push([text1,text2,text3,text4])
					// console.log(JSON.stringify(response.data));
				  })
				  .catch((error) => {
					console.log(error);
				  });
				  
				
			
			  })
			  .catch((error) => {
				console.log(error);
			  });
		  }));
		  res.send(outputArr)	
	})
	.catch((error) => {
	  console.log(error);
	});
	
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
