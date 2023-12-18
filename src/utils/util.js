function formatBytesToMB(bytes, decimals = 2) {
  return (bytes / (1024 * 1024)).toFixed(2);
}

function createUUID(a) {
  return a // if the placeholder was passed, return
    ? // a random number from 0 to 15
      (
        a ^ // unless b is 8,
        ((Math.random() * // in which case
          16) >> // a random number from
          (a / 4))
      ) // 8 to 11
        .toString(16) // in hexadecimal
    : // or otherwise a concatenated string:
      (
        [1e7] + // 10000000 +
        -1e3 + // -1000 +
        -4e3 + // -4000 +
        -8e3 + // -80000000 +
        -1e11
      ) // -100000000000,
        .replace(
          // replacing
          /[018]/g, // zeroes, ones, and eights with
          createUUID, // random hex digits
        );
}
const getUniqueId = () => {
  const date = new Date();
  const dd = date.getDate();
  const mm = date.getMonth();
  const yyyy = date.getFullYear();
  const hh = date.getHours();
  const mi = date.getMinutes();
  const ss = date.getSeconds();
  const ms = date.getMilliseconds();

  return `id-${dd}${mm}${yyyy}${hh}${mi}${ss}${ms}`;
};

function num_delimiter(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export {formatBytesToMB, createUUID, getUniqueId, num_delimiter};
