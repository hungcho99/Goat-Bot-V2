import Y2mateApi from 'y2mate-api';

const y2mate = new Y2mateApi();
const videoUrl = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';

const results = async function () { await y2mate.search(videoUrl) }
const downloadLink = results[0].link;
