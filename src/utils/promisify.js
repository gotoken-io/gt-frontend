export const PromiseCallback = callback =>
  new Promise((resolve, reject) =>
    callback((err, res) => {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    }),
  );

export const Delay = seconds => {
  return new Promise(resolve => {
    setTimeout(resolve, seconds);
  });
};
