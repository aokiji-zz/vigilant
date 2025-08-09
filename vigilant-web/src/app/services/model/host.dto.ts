export enum HostStatus {
  UP = 'UP',
  DOWN = 'DOWN',
  PENDING = 'PENDING'
}

enum IpAddressType {
  IPV4 = 'IPV4',
  IPV6 = 'IPV6',
}


export interface Host {
  id?: number;
  host?: string;
  addressType?: IpAddressType;
  ipAddress?: string;
  createdAt?: Date;
  updatedAt?: Date;
  macAddress?: string;
  os?: string;
  cpes?: string[];
  cves?: string[];
  portNumbers?: number[];
  ports?: any[];
  vulnerabilities?: Vulnerability[];
  hostnames?: string[];
  status?: HostStatus;
  lastScanDate?: Date;
  lastScanTool?: string;
  blameUser?: Date;
  blameUserId?: number;
  whois: Whois
}

// interfaces/vulnerability.interface.ts
interface Whois {
  country: string
}

interface Vulnerability {
  id?: number;
  description?: string;
  cve: string;
  title?: string;
  references?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

