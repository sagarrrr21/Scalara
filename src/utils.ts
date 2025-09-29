const MAX_LEN = 5;

export function generate() {
  let Id = "";
  const subset = "12345677890ksdjflkshbajasbdjasdasa";
  for (let i = 0; i < MAX_LEN; i++) {
    Id += subset[Math.floor(Math.random() * subset.length)];
  }
  return Id;
}
