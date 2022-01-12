// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: 'cloud1-2gti864359941aaa'
})
const db = cloud.database()
const $ = db.command.aggregate
// 云函数入口函数
exports.main = async (event, context) => {
  return await db.collection('rooms').aggregate()
    .lookup({
      from: "offices",
      localField: "office_id",
      foreignField: "office_id",
      as: "office"
    })
    .replaceRoot({
      newRoot:$.mergeObjects([$.arrayElemAt(['$office',0]),"$$ROOT"])
    })
    .project({
      office:0
    })
    .end()
}