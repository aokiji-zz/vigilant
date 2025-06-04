import { Host } from "../services/model/host";
const calculateRisk = (host: Host): string => {
  let riskScore = 0;

  if (host.cves && host.cves.length > 2) {
    riskScore += 3;
  }

  if (host.portNumbers && host.portNumbers.length > 5) {
    riskScore += 2;
  }

  if (riskScore >= 5) return 'HIGH';
  if (riskScore >= 3) return 'MEDIUM';
  return 'LOW';
};

export { calculateRisk };