const processData = (raw) => {
  try {
    return JSON.parse(raw);
  } catch (ex) {
    return raw;
  }
};

export default fn => (err, res) => {
  if (err) {
    fn(err);
    return;
  } else if (!res.ok) {
    fn(new Error('Unknow error'));
  }
  fn(null, processData(res.body || res.text));
};
