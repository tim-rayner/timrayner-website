import { Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";

interface NavBrandProps {
  logo?: string;
}

export default function NavBrand({ logo }: NavBrandProps) {
  if (logo) {
    return (
      <Link href="/" style={{ display: "block", lineHeight: 0 }}>
        <Image
          src={logo}
          alt="Tim Rayner"
          width={120}
          height={32}
          style={{ objectFit: "contain" }}
        />
      </Link>
    );
  }

  return (
    <Link href="/" style={{ textDecoration: "none" }}>
      <Typography
        component="span"
        sx={{
          fontSize: "1.2rem",
          fontWeight: 700,
          letterSpacing: "-0.03em",
          color: "text.primary",
          userSelect: "none",
        }}
      >
        Tim Rayner
      </Typography>
    </Link>
  );
}
