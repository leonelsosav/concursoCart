class DBDriver {
    constructor(obj) {
        this.db = obj;
    }

    async create(collection, id, data){
        return await new Promise((resolve, reject) => {
            this.db.collection(collection).doc(id).set(data).then(() =>{
                let objId = { id: id };
                resolve(Object.assign({}, objId, data));
            }).catch((err) =>{
                reject(false);
            });
        });
    }

    async read(collection, id){
        var res = {};
        return await new Promise((resolve, reject) =>{
            this.db.collection(collection).doc(id).get().then((doc) =>{
                let objId = { id: doc.id };
                res = Object.assign({}, objId, doc.data());
            }).then(() =>{
                resolve(res);
            }).catch((err) =>{
                reject(err);
            });
        });
    }

    async update(collection, id, data){
        return await new Promise((resolve, reject) => {
            this.db.collection(collection).doc(id).update(data).then(() =>{
                let objId = { id: id };
                resolve(Object.assign({}, objId, data));
            }).catch((err) =>{
                reject(false);
            });
        });
    }

    async delete(collection, id) {
        return await new Promise((resolve, reject) => {
            this.db.collection(collection).doc(id).delete().then(() => {
                resolve(true);
            }).catch((err) => {
                reject(false);
            });
        });
    }

    async readWhere(collection, val1, condition, val2){
        var res = [];
        return await new Promise((resolve, reject) =>{
            this.db.collection(collection).where(val1, condition, val2).get().then((querySnapShot) =>{
                querySnapShot.forEach((doc) => {
                    let objId = { id: doc.id };
                    res.push(Object.assign({}, objId, doc.data()));
                });
            }).then(() => {
                resolve(res);
            }).catch((err) => {
                reject(err);
            });
        });
    }

    async readWhereWhereOrder(collection, val1, condition, val2, val1_2, condition_2, val2_2, orderVal, typeOrder){
        var res = [];
        return await new Promise((resolve, reject) =>{
            this.db.collection(collection).where(val1, condition, val2).where(val1_2, condition_2, val2_2)
                .orderBy(orderVal, typeOrder).get().then((querySnapShot) =>{
                querySnapShot.forEach((doc) => {
                    let objId = { id: doc.id };
                    res.push(Object.assign({}, objId, doc.data()));
                });
            }).then(() => {
                resolve(res);
            }).catch((err) => {
                reject(err);
            });
        });
    }

    async readAll(collection) {
        var res = [];
        return await new Promise((resolve, reject) => {
            this.db.collection(collection).get().then((querySnapShot) => {
                querySnapShot.forEach((doc) => {
                    let objId = { id: doc.id };
                    res.push(Object.assign({}, objId, doc.data()));
                });
            }).then(() => {
                resolve(res);
            }).catch((err) => {
                reject(err);
            });
        });
    }

    async getNewNumId(collection){
        var id = 1;
        return await new Promise((resolve, reject) => {
            this.db.collection(collection).orderBy("Id", "desc").limit(1).get().then((querySnapShot) => {
                if (!querySnapShot.empty) id = querySnapShot.docs[0].data().Id + 1;
                resolve(id.toString());
            }).catch((err) => {
                reject(err);
            });
        });
    }
}