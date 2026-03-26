import path from "path"
import { fileURLToPath } from "url"

const rootDirectory = path.dirname(fileURLToPath(import.meta.url))

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  outputFileTracingRoot: rootDirectory,
  turbopack: {
    root: rootDirectory,
  },
}

export default nextConfig
