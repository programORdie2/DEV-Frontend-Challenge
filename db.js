const url = 'https://programordie-1-b6431438.deta.app/devto/';

async function _vote(vote) {
    let db = await fetch(url + '?vote=' + vote, { method: 'POST' });
    db = await db.json();
    return db
}

async function vote(vote) {
    try {
        db = await _vote(vote);
    } catch (error) {
        console.log(error);
        db = await _vote(vote);
    }
    console.log(db);
    return db;
}