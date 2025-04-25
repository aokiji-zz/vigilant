export function isIpOrDomain(
  input: string,
): 'IP' | 'IP_RANGE' | 'DOMAIN' | 'INVALID' {
  // Regex para IPs no formato padrão (ex.: 192.168.15.1)
  const ipRegex =
    /^(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)$/;

  // Regex para ranges de IPs no formato (ex.: 192-255.168-255.1-255)
  const ipRangeRegex =
    /^(\d{1,3}(-\d{1,3})?)\.(\d{1,3}(-\d{1,3})?)\.(\d{1,3}(-\d{1,3})?)\.(\d{1,3}(-\d{1,3})?)$/;

  // Regex para domínios (ex.: example.com)
  const domainRegex = /^(?!:\/\/)([a-zA-Z0-9-_]+\.)+[a-zA-Z]{2,}$/;

  if (ipRegex.test(input)) {
    return 'IP';
  } else if (ipRangeRegex.test(input)) {
    return 'IP_RANGE';
  } else if (domainRegex.test(input)) {
    return 'DOMAIN';
  } else {
    return 'INVALID';
  }
}