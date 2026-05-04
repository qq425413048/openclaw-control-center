#!/bin/bash
# OpenClaw Control Center 启动脚本

cd "$(dirname "$0")"

echo "正在启动 OpenClaw Control Center..."
echo "工作目录: $(pwd)"
echo "环境文件: $(ls -la .env 2>/dev/null || echo '未找到')"

# 检查是否已安装PM2
if command -v pm2 &> /dev/null; then
    echo "使用PM2启动..."
    pm2 start ecosystem.config.cjs
    pm2 save
    pm2 startup | tail -1 | sh
    echo "PM2启动完成"
else
    echo "PM2未安装，使用普通Node启动..."
    # 检查是否已构建
    if [ ! -d "dist" ]; then
        echo "构建项目..."
        npm run build
    fi
    
    echo "启动控制中心..."
    npm run dev:ui &
    echo "控制中心已在后台启动，PID: $!"
fi

echo "控制中心应该在 http://192.168.3.198:4310 上运行"
echo "检查状态: curl -s http://127.0.0.1:4310/ >/dev/null && echo '运行正常' || echo '启动失败'"