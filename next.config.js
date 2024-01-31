/** @type {import('next').NextConfig} */
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  // nextConfig,
  async redirects() {
    return [
      {
        source: "/",
        destination: "/product", // ตั้งค่าให้แสดงหน้าที่ต้องการเป็นหน้าหลัก
        permanent: true,
      },
    ];
  },

  webpack: (config) => {
    // เพิ่ม plugin สำหรับคัดลอกไฟล์
    config.plugins.push(
      new CopyWebpackPlugin({
        patterns: [
          {
            from: 'D:/BA/olylife/file/images', // ระบุโฟลเดอร์ที่ต้องการคัดลอก
            to: 'D:/BA/olylife/frontend/public/assets/images', // ระบุโฟลเดอร์ที่ต้องการให้ไฟล์ถูกคัดลอกไป
          },
        ],
      })
    );

    return config;
  },
};
