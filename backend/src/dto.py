from dataclasses import dataclass
from typing import List, Optional

DEFAULT_LANG = "en"


@dataclass
class AppSettings:
    """Represents the application's settings as stored in settings.json."""

    language: str = DEFAULT_LANG
    last_image_dir: str = ""
    special_k_folder_path: str = ""
    texconv_executable_path: str = ""
    output_height: int = 1024
    last_active_view: str = "dump"
    theme: str = "dark"

    @property
    def output_width(self) -> int:
        """Calculated width based on height."""
        return int(self.output_height * (53 / 64))


@dataclass
class ImageInfo:
    """Represents a single image displayed in the frontend."""

    src: str
    alt: str
    path: str


@dataclass
class ImageListResponse:
    """Response for get_image_list."""

    success: bool
    images: List[ImageInfo]
    error: Optional[str] = None
