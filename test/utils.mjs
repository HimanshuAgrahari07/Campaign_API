import fetch from "node-fetch";
const baseUrl = `http://localhost:3001`;

import FormData from "form-data";

export async function postNoAuth(route, body, suppress = false) {
  const res = await fetch(`${baseUrl}${route}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (res.status == 204) {
    return res;
  }

  const resJson = await res.json();

  if (resJson.statusCode >= 400 && !suppress) {
    console.error(resJson);
  }

  return resJson;
}

export async function putNoAuth(route, body, suppress = false) {
  const res = await fetch(`${baseUrl}${route}`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (res.status == 204) {
    return res;
  }

  const resJson = await res.json();

  if (resJson.statusCode >= 400 && !suppress) {
    console.error(resJson);
  }

  return resJson;
}

export async function getNoAuth(route, suppress = false) {
  const res = await fetch(`${baseUrl}${route}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  if (res.status == 204) {
    return res;
  }

  const resJson = await res.json();

  if (resJson.statusCode >= 400 && !suppress) {
    console.error(resJson);
  }

  return resJson;
}

export async function get(route, token, suppress = false) {
  const res = await fetch(`${baseUrl}${route}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : undefined,
    },
    credentials: "include",
  });

  if (res.status == 204) {
    return res;
  }

  const resJson = await res.json();

  if (resJson.statusCode >= 400 && !suppress) {
    console.error(resJson);
  }

  return resJson;
}

export async function getWithHeaders(route, headers, suppress = false) {
  const res = await fetch(`${baseUrl}${route}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...headers,
    },
    credentials: "include",
  });

  if (res.status == 204) {
    return res;
  }

  const resJson = await res.json();

  if (resJson.statusCode >= 400 && !suppress) {
    console.error(resJson);
  }

  return resJson;
}

export async function post(route, body, token, suppress = false) {
  const res = await fetch(`${baseUrl}${route}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : undefined,
    },
    body: JSON.stringify(body),
    credentials: "include",
  });

  if (res.status == 204) {
    return res;
  }

  const resJson = await res.json();

  if (resJson.statusCode >= 400 && !suppress) {
    console.error(resJson);
  }

  return resJson;
}

export async function put(route, body, token, suppress = false) {
  const res = await fetch(`${baseUrl}${route}`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : undefined,
    },
    body: JSON.stringify(body),
    credentials: "include",
  });

  if (res.status == 204) {
    return res;
  }

  const resJson = await res.json();

  if (resJson.statusCode >= 400 && !suppress) {
    console.error(resJson);
  }

  return resJson;
}

export async function putWithHeaders(route, body, headers, suppress = false) {
  const res = await fetch(`${baseUrl}${route}`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...headers,
    },
    body: body ? JSON.stringify(body) : null,
    credentials: "include",
  });

  if (res.status == 204) {
    return res;
  }

  const resJson = await res.json();

  if (resJson.statusCode >= 400 && !suppress) {
    console.error(resJson);
  }

  return resJson;
}

export async function postWithHeaders(route, body, headers, suppress = false) {
  const res = await fetch(`${baseUrl}${route}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...headers,
    },
    body: JSON.stringify(body),
    credentials: "include",
  });

  if (res.status == 204) {
    return res;
  }

  const resJson = await res.json();

  if (resJson.statusCode >= 400 && !suppress) {
    console.error(resJson);
  }

  return resJson;
}

export async function patch(route, body, token, suppress = false) {
  const res = await fetch(`${baseUrl}${route}`, {
    method: "PATCH",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : undefined,
    },
    body: JSON.stringify(body),
    credentials: "include",
  });

  if (res.status == 204) {
    return res;
  }

  const resJson = await res.json();

  if (resJson.statusCode >= 400 && !suppress) {
    console.error(resJson);
  }

  return resJson;
}

export async function patchWithHeaders(route, body, headers, suppress = false) {
  const res = await fetch(`${baseUrl}${route}`, {
    method: "PATCH",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...headers,
    },
    body: JSON.stringify(body),
    credentials: "include",
  });

  if (res.status == 204) {
    return res;
  }

  const resJson = await res.json();

  if (resJson.statusCode >= 400 && !suppress) {
    console.error(resJson);
  }

  return resJson;
}

export async function deleteReq(route, token, suppress = false) {
  const res = await fetch(`${baseUrl}${route}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : undefined,
    },
    credentials: "include",
  });

  if (res.status == 204) {
    return res;
  }

  const resJson = await res.json();

  if (resJson.statusCode >= 400 && !suppress) {
    console.error(resJson);
  }

  return resJson;
}

export async function deleteWithHeaders(route, headers, suppress = false) {
  const res = await fetch(`${baseUrl}${route}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...headers,
    },
    credentials: "include",
  });

  if (res.status == 204) {
    return res;
  }

  const resJson = await res.json();

  if (resJson.statusCode >= 400 && !suppress) {
    console.error(resJson);
  }

  return resJson;
}

export async function uploadWithHeaders(
  route,
  { method, fileSizeInBytes, readStream },
  headers,
  suppress = false
) {
  const formData = new FormData();
  formData.append("file", readStream);

  const res = await fetch(`${baseUrl}${route}`, {
    method,
    headers: {
      Accept: "application/json",
      //"Content-Type": "multipart/form-data",
      //"Content-length": fileSizeInBytes,
      ...headers,
    },
    body: formData,
    credentials: "include",
  });

  if (res.status == 204) {
    return res;
  }

  const resJson = await res.json();

  if (resJson.statusCode >= 400 && !suppress) {
    console.error(resJson);
  }

  return resJson;
}

export function waitMs({ ms }) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), ms);
  });
}
