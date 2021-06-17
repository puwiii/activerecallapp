import {firestore} from 'firebase/admin'

export default (request, response) => {


    firestore
    .collection('decks')
    .doc()
    .get()
    .then((doc) => {
        const data = doc.data()
        response.json({
            "el-pepe": "es el pepe"
          })
    })
    .catch(()=>{
        response.status(404).end()
    })

}