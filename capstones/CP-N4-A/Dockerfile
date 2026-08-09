FROM python:3.11-slim

# Resource limits + non-root user (CP-N4-A acceptance criterion 6 + 8).
LABEL org.opencontainers.image.title="pyarcana-cp-n4-a"
LABEL org.opencontainers.image.description="Governed Python service platform — CP-N4-A starter"
LABEL org.opencontainers.image.license="CC0-1.0"

WORKDIR /app
COPY requirements.txt solution.py generator.py /app/
COPY fixtures/ /app/fixtures/

# Install only what is needed (no build tools kept).
RUN pip install --no-cache-dir -r requirements.txt \
    && useradd --create-home --uid 10001 appuser \
    && chown -R appuser:appuser /app

USER appuser

EXPOSE 8099

# Resource limits are enforced at the container orchestrator layer; here we
# expose /healthz and /readyz so the platform can probe and evict.
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD python3 -c "import urllib.request, sys; sys.exit(0 if urllib.request.urlopen('http://127.0.0.1:8099/healthz', timeout=2).status==200 else 1)"

CMD ["python3", "solution.py", "--port", "8099", "--state-dir", "/tmp/state"]
