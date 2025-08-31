class HoHatchError(Exception):
    """Base exception for the HoHatch application."""

    def __init__(self, message="An unexpected error occurred."):
        self.message = message
        super().__init__(self.message)


class ConfigError(HoHatchError):
    """Exception related to configuration errors."""

    pass


class TexconvError(HoHatchError):
    """Exception related to texconv execution errors."""

    pass


class FileSystemError(HoHatchError):
    """Exception related to file system operations."""

    pass


class DownloadError(HoHatchError):
    """Exception related to downloading files."""

    pass


class ApiError(HoHatchError):
    """Exception for errors that should be bubbled up to the frontend."""

    pass
