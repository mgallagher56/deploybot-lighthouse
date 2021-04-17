addResult = (db, repo, lighthouseResult, callback) => {
    db.collection(repo).insertOne(lighthouseResult, (err, result) => {
        if (err)
            throw err;
        callback(result);
    }
    )
};

module.exports.addResult = addResult;
