const axios = require('axios');
const fs = require('fs');
const { getStreamFromURL } = global.utils;
const isURL = z => /^http(|s):\/\//.test(z);


function infoTik(url) {
  return axios({ method: 'post', url: `https://tikwm.com/api/`,  data: { url }, headers: { 'content-type': 'application/json'} }).then(res => res.data.data);
};
function infoFb(url) {
  return axios.get(`https://fb.toosj888.repl.co/api/fb/info-post?url=${url}`).then(res => res.data);
};
function filterSocialMedia(url) {
  if (/^(https?:\/\/)?((w{3}\.)?)facebook\.com/.test(url)) {
    return "facebook";
  } else if (/^(https?:\/\/)?((w{3}\.)?)twitter\.com/.test(url)) {
    return "twitter";
  } else if (/^(https?:\/\/)?((w{3}\.)?)instagram\.com/.test(url)) {
    return "instagram";
  } else if (/^(https?:\/\/)?((w{3}\.)?)youtube\.com/.test(url)) {
    return "youtube";
  } else if (/(^https:\/\/)((vm|vt|www|v)\.)?(tiktok|douyin|iesdouyin)\.com\//.test(url)) {
    return "tiktok";
  } else {
    return "unknown";
  }
};

module.exports = {
	config: {
		name: "Autodown", 
		version: "1.0",
		author: "NgChauAnh",
		countDown: 5,
		role: 0, 
		shortDescription: "Tiktok",
		longDescription: {
			vi: "",
			en: ""
		},
		category: "media",
		guide: {
			vi: "   "
				+ "",
			en: " "
				+ ""
		},
		category: "Tool"
	},
    onStart: async function ({ }) { },
	onChat: async function ({ message, event, api }) {
    const msg = event.body;
	if(!isURL(msg)) return;
    let nameSocial = filterSocialMedia(msg);
    
    //Facebook
	if(nameSocial == 'facebook') {
        try {
        const json = await infoFb(msg);
        const filter = type => json.attachment.filter($=>$.__typename == type);		
        const photo = filter('Photo'), video = filter('Video');
        if(video.length == 0 && photo.length == 0) return;
        if(video.length == 0){
        const imgList = photo.map(i => i.photo_image || i.image || {});
        const attachmentList = await Promise.all(imgList.map(async img => { return await getStreamFromURL(img.uri, `${img}.jpg`) }).filter(att => att !== null));
        return await message.reply({ body: json.message, attachment: attachmentList });
       };
        const videourl = video.map(i => i.playable_url_quality_hd || i.playable_url || {});
        return await message.reply({ body: json.message, attachment:  await getStreamFromURL(videourl[0], `hungchozz.mp4`) });
       }  
       catch(e) { return  message.reply({ body: "Đã xảy ra lỗi khi tải về tệp đính kèm." })};
    };

    //Tiktok
    if(nameSocial == 'tiktok') {
        try{
        const data = await infoTik(msg);
        if(data.images){ const attachmentStreams = await Promise.all(data.images.map(async img => { return await getStreamFromURL(img,`${img}.jpg`)}));
        return await message.reply({ body:  `Tiêu đề: ${data.title}`, attachment: attachmentStreams });
        };
         return await message.reply({ body: `Tiêu đề: ${data.title}`, attachment: await getStreamFromURL(data.play,`${data.id}.mp4`)});
        } catch(e){ return  message.reply({ body: "Đã xảy ra lỗi khi tải về tệp đính kèm." }) }
      } 
    }
};