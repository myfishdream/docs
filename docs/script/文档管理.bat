@echo off
REM ����Ҫִ�е� Node.js �ű�·��
set NODE_SCRIPT_PATH="F:\��̬����ջ-Beta\Github-docs\docs\script\AutoCreateDocs.js"

REM ���ù���Ŀ¼��Node.js �ű����ڵ��ļ��У�
set WORKING_DIR="F:\��̬����ջ-Beta\Github-docs\docs\script"

REM ��ӡ·����Ϣ
echo NODE_SCRIPT_PATH: %NODE_SCRIPT_PATH%
echo WORKING_DIR: %WORKING_DIR%

REM ���·���Ƿ����
if not exist %NODE_SCRIPT_PATH% (
    echo ����Node.js �ű�·�������ڣ�
    pause
    exit /b
)

if not exist %WORKING_DIR% (
    echo ���󣺹���Ŀ¼·�������ڣ�
    pause
    exit /b
)

REM ��� Node.js �Ƿ����
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo ����δ�ҵ� Node.js����ȷ���Ѱ�װ�����û���������
    pause
    exit /b
)

REM �������д��ڲ�ִ�� Node.js �ű�
echo ����ִ�� Node.js �ű�...
cmd /c "cd /d %WORKING_DIR% && node %NODE_SCRIPT_PATH%"

REM �ӳ� 3 ���رմ���
timeout /t 1 >nul
exit