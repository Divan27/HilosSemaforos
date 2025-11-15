let state = "red";

onmessage = async (e) => {
  if (e.data === "GO") {
    state = "green";
    postMessage({ state });

    await new Promise((r) => setTimeout(r, 4000)); // verde

    state = "yellow";
    postMessage({ state });

    await new Promise((r) => setTimeout(r, 1500)); // amarillo
  }

  if (e.data === "STOP") {
    state = "red";
    postMessage({ state });
  }
};
