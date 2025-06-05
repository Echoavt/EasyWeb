// Basic GitHub API helpers
const REPO_OWNER = 'YOUR_GITHUB_USERNAME';
const REPO_NAME = 'YOUR_REPOSITORY_NAME';
const BRANCH = 'gh-pages';

function getToken() {
    const token = localStorage.getItem('oauth_token');
    const exp = localStorage.getItem('oauth_expires');
    if (!token || !exp || Date.now() > parseInt(exp)) return null;
    return token;
}

function api(url, options = {}) {
    const token = getToken();
    const headers = options.headers || {};
    if (token) headers['Authorization'] = 'Bearer ' + token;
    return fetch(url, { ...options, headers });
}

// CRUD operations for files
async function getFile(path) {
    const res = await api(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}?ref=${BRANCH}`);
    if (!res.ok) throw new Error('Failed to fetch file');
    return res.json();
}

async function putFile(path, content, sha) {
    const body = {
        message: `Update ${path}`,
        content: btoa(unescape(encodeURIComponent(content))),
        branch: BRANCH
    };
    if (sha) body.sha = sha;
    const res = await api(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });
    if (!res.ok) throw new Error('Failed to write file');
    return res.json();
}

async function deleteFile(path, sha) {
    const res = await api(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: `Delete ${path}`, sha, branch: BRANCH })
    });
    if (!res.ok) throw new Error('Failed to delete file');
    return res.json();
}

export { getFile, putFile, deleteFile, getToken };
