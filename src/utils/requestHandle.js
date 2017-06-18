import R from 'ramda';

export default fn => (err, res) => {
  if (err) {
    fn(err);
    return;
  } else if (!res.ok) {
    fn(new Error('Unknow error'));
  }

  R.tryCatch(R.pipe(JSON.parse, fn), fn)(res.body);
};
