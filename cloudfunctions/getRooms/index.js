// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: 'cloud1-2gti864359941aaa'
})
const db = cloud.database()
const _ = db.command
const $ = _.aggregate
// 云函数入口函数
exports.main = async (event, context) => {
  console.log(event)
  let condition = {}
  if(event.floor){
    condition.floor = event.floor
  }
  if(event.office_id){
    condition.office_id=event.office_id
  }
  if(event.chair){
    condition.chair=_.gte(event.chair)
  }
  if(event.device&&event.device.length>0){
    condition.device=_.all(event.device)
  }
  return await db.collection('rooms').aggregate()
    .lookup({
      from: "offices",
      localField: "office_id",
      foreignField: "office_id",
      as: "office"
    })
    .match(
      condition
    )
    .replaceRoot({
      newRoot:$.mergeObjects([$.arrayElemAt(['$office',0]),"$$ROOT"])
    })
    .project({
      office:0
    })
    .end()
}