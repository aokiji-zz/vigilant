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
  ports?: Port[];
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
