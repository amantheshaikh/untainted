"""
Logging configuration for the Untainted backend.

This module provides structured JSON logging for production and
readable colored output for development.

Usage:
    from logging_config import setup_logging, get_logger

    # Call once at startup
    setup_logging()

    # Get logger in each module
    logger = get_logger(__name__)
    logger.info("Processing request", extra={"barcode": "12345"})
"""
import logging
import sys
import os
import json
from datetime import datetime, timezone
from typing import Any, Dict, Optional


class JSONFormatter(logging.Formatter):
    """
    Formatter that outputs JSON strings for structured logging.
    Used in production for log aggregation systems.
    """

    def format(self, record: logging.LogRecord) -> str:
        log_data: Dict[str, Any] = {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
        }

        # Add exception info if present
        if record.exc_info:
            log_data["exception"] = self.formatException(record.exc_info)

        # Add extra fields (excluding standard LogRecord attributes)
        standard_attrs = {
            "name", "msg", "args", "created", "filename", "funcName",
            "levelname", "levelno", "lineno", "module", "msecs",
            "pathname", "process", "processName", "relativeCreated",
            "stack_info", "exc_info", "exc_text", "thread", "threadName",
            "taskName", "message"
        }
        for key, value in record.__dict__.items():
            if key not in standard_attrs:
                log_data[key] = value

        return json.dumps(log_data)


class DevelopmentFormatter(logging.Formatter):
    """
    Colored formatter for development environments.
    More readable than JSON for local debugging.
    """

    COLORS = {
        "DEBUG": "\033[36m",     # Cyan
        "INFO": "\033[32m",      # Green
        "WARNING": "\033[33m",   # Yellow
        "ERROR": "\033[31m",     # Red
        "CRITICAL": "\033[35m",  # Magenta
    }
    RESET = "\033[0m"

    def format(self, record: logging.LogRecord) -> str:
        color = self.COLORS.get(record.levelname, self.RESET)
        timestamp = datetime.now().strftime("%H:%M:%S")

        # Format: [TIME] LEVEL module: message
        formatted = f"{color}[{timestamp}] {record.levelname:8}{self.RESET} {record.name}: {record.getMessage()}"

        # Add extra fields if present
        standard_attrs = {
            "name", "msg", "args", "created", "filename", "funcName",
            "levelname", "levelno", "lineno", "module", "msecs",
            "pathname", "process", "processName", "relativeCreated",
            "stack_info", "exc_info", "exc_text", "thread", "threadName",
            "taskName", "message"
        }
        extras = {k: v for k, v in record.__dict__.items() if k not in standard_attrs}
        if extras:
            formatted += f" | {extras}"

        # Add exception info if present
        if record.exc_info:
            formatted += f"\n{self.formatException(record.exc_info)}"

        return formatted


def setup_logging(
    level: Optional[str] = None,
    json_format: Optional[bool] = None
) -> None:
    """
    Configure logging for the application.

    Args:
        level: Log level (DEBUG, INFO, WARNING, ERROR, CRITICAL).
               Defaults to LOG_LEVEL env var or INFO.
        json_format: If True, use JSON format. If False, use colored dev format.
                     Defaults to True if ENVIRONMENT=production, else False.
    """
    # Determine log level
    if level is None:
        level = os.environ.get("LOG_LEVEL", "INFO").upper()

    # Determine format
    if json_format is None:
        environment = os.environ.get("ENVIRONMENT", "development")
        json_format = environment.lower() == "production"

    # Create handler
    handler = logging.StreamHandler(sys.stdout)

    if json_format:
        handler.setFormatter(JSONFormatter())
    else:
        handler.setFormatter(DevelopmentFormatter())

    # Configure root logger
    root_logger = logging.getLogger()
    root_logger.setLevel(getattr(logging, level))

    # Remove existing handlers and add our handler
    root_logger.handlers.clear()
    root_logger.addHandler(handler)

    # Suppress noisy third-party loggers
    logging.getLogger("httpx").setLevel(logging.WARNING)
    logging.getLogger("httpcore").setLevel(logging.WARNING)
    logging.getLogger("uvicorn.access").setLevel(logging.WARNING)


def get_logger(name: str) -> logging.Logger:
    """
    Get a logger instance for a module.

    Args:
        name: Usually __name__ of the calling module.

    Returns:
        Configured logger instance.
    """
    return logging.getLogger(name)


class RequestLogger:
    """
    Context manager for logging request lifecycle.

    Usage:
        with RequestLogger(logger, request_id="abc123", endpoint="/check") as req_log:
            req_log.info("Processing started")
            # ... do work ...
            req_log.info("Processing complete", extra={"duration_ms": 150})
    """

    def __init__(self, logger: logging.Logger, **context: Any):
        self.logger = logger
        self.context = context
        self.start_time: Optional[float] = None

    def __enter__(self) -> "RequestLogger":
        import time
        self.start_time = time.time()
        self.info("Request started")
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        import time
        duration_ms = int((time.time() - self.start_time) * 1000) if self.start_time else 0

        if exc_type:
            self.error(
                "Request failed",
                extra={"duration_ms": duration_ms, "error": str(exc_val)},
                exc_info=(exc_type, exc_val, exc_tb)
            )
        else:
            self.info("Request completed", extra={"duration_ms": duration_ms})

        return False  # Don't suppress exceptions

    def _log(self, level: int, message: str, extra: Optional[Dict[str, Any]] = None, **kwargs):
        merged_extra = {**self.context, **(extra or {})}
        self.logger.log(level, message, extra=merged_extra, **kwargs)

    def debug(self, message: str, extra: Optional[Dict[str, Any]] = None):
        self._log(logging.DEBUG, message, extra)

    def info(self, message: str, extra: Optional[Dict[str, Any]] = None):
        self._log(logging.INFO, message, extra)

    def warning(self, message: str, extra: Optional[Dict[str, Any]] = None):
        self._log(logging.WARNING, message, extra)

    def error(self, message: str, extra: Optional[Dict[str, Any]] = None, **kwargs):
        self._log(logging.ERROR, message, extra, **kwargs)
