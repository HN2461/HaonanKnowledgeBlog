# Requirements Document

## Introduction

本功能旨在提升个人技术博客网站的阅读体验和交互体验。主要包括阅读进度条、预计阅读时间优化、字体大小调节、全屏阅读模式、页面切换动画、骨架屏加载、图片放大预览和代码块复制功能。这些功能将显著改善用户在浏览和阅读技术笔记时的体验。

## Glossary

- **Reading_Progress_Bar**: 阅读进度条组件，显示用户当前阅读位置占文章总长度的百分比
- **Reading_Time_Calculator**: 阅读时间计算器，基于文章字数和平均阅读速度计算预计阅读时长
- **Font_Size_Controller**: 字体大小控制器，允许用户调整文章正文的字体大小
- **Fullscreen_Reader**: 全屏阅读模式，隐藏导航栏和侧边栏，提供沉浸式阅读体验
- **Page_Transition**: 页面切换动画，使用 Vue Transition 实现页面间的平滑过渡
- **Skeleton_Screen**: 骨架屏组件，在内容加载时显示占位符动画
- **Image_Lightbox**: 图片灯箱组件，点击图片后放大预览
- **Code_Copy_Button**: 代码复制按钮，一键复制代码块内容到剪贴板

## Requirements

### Requirement 1

**User Story:** As a reader, I want to see my reading progress while scrolling through an article, so that I can know how much content remains.

#### Acceptance Criteria

1. WHEN a user scrolls through the note detail page THEN the Reading_Progress_Bar SHALL display the current scroll position as a percentage (0-100%) at the top of the viewport
2. WHEN the user reaches the end of the article THEN the Reading_Progress_Bar SHALL display 100% progress
3. WHEN the user navigates to a different page THEN the Reading_Progress_Bar SHALL reset to 0%
4. WHILE the Reading_Progress_Bar is visible THEN the Reading_Progress_Bar SHALL use a smooth animation for progress updates with a transition duration of 100ms or less

### Requirement 2

**User Story:** As a reader, I want to see an accurate estimated reading time for each article, so that I can plan my reading session.

#### Acceptance Criteria

1. WHEN a note detail page loads THEN the Reading_Time_Calculator SHALL display the estimated reading time based on word count divided by 200 words per minute for Chinese text
2. WHEN the article contains code blocks THEN the Reading_Time_Calculator SHALL count code content at a reduced rate of 100 characters per minute
3. WHEN displaying reading time THEN the Reading_Time_Calculator SHALL show the time in minutes with a minimum display of 1 minute

### Requirement 3

**User Story:** As a reader, I want to adjust the font size of articles, so that I can read comfortably based on my preference.

#### Acceptance Criteria

1. WHEN a user clicks the font size increase button THEN the Font_Size_Controller SHALL increase the article body font size by 2px up to a maximum of 24px
2. WHEN a user clicks the font size decrease button THEN the Font_Size_Controller SHALL decrease the article body font size by 2px down to a minimum of 12px
3. WHEN a user adjusts font size THEN the Font_Size_Controller SHALL persist the preference to localStorage
4. WHEN a user returns to the site THEN the Font_Size_Controller SHALL restore the previously saved font size preference
5. WHEN a user clicks the reset button THEN the Font_Size_Controller SHALL restore the default font size of 16px

### Requirement 4

**User Story:** As a reader, I want to enter fullscreen reading mode, so that I can focus on the content without distractions.

#### Acceptance Criteria

1. WHEN a user clicks the fullscreen button on the note detail page THEN the Fullscreen_Reader SHALL hide the header, sidebar, and breadcrumb navigation
2. WHILE in fullscreen mode THEN the Fullscreen_Reader SHALL display a floating toolbar with exit button, font controls, and theme toggle
3. WHEN a user presses the Escape key or clicks the exit button THEN the Fullscreen_Reader SHALL restore the normal layout
4. WHEN entering or exiting fullscreen mode THEN the Fullscreen_Reader SHALL apply a smooth transition animation with duration of 300ms
5. WHILE in fullscreen mode THEN the Fullscreen_Reader SHALL center the article content with a maximum width of 800px

### Requirement 5

**User Story:** As a user, I want smooth page transitions when navigating between pages, so that the browsing experience feels polished.

#### Acceptance Criteria

1. WHEN a user navigates between routes THEN the Page_Transition SHALL apply a fade transition with duration of 200ms
2. WHEN transitioning between pages THEN the Page_Transition SHALL ensure the outgoing page fades out before the incoming page fades in
3. WHEN the transition completes THEN the Page_Transition SHALL scroll the new page to the top position

### Requirement 6

**User Story:** As a user, I want to see loading placeholders while content loads, so that I understand the page structure before content appears.

#### Acceptance Criteria

1. WHEN the note detail page is loading content THEN the Skeleton_Screen SHALL display placeholder shapes matching the article layout (title, meta info, content blocks)
2. WHEN the note list page is loading THEN the Skeleton_Screen SHALL display card-shaped placeholders matching the note card layout
3. WHEN content finishes loading THEN the Skeleton_Screen SHALL fade out and reveal the actual content with a transition of 200ms
4. WHILE displaying skeleton placeholders THEN the Skeleton_Screen SHALL show a shimmer animation effect

### Requirement 7

**User Story:** As a reader, I want to click on images to view them in a larger size, so that I can see details clearly.

#### Acceptance Criteria

1. WHEN a user clicks on an image in the markdown content THEN the Image_Lightbox SHALL display the image in a centered overlay with a dark backdrop
2. WHILE the lightbox is open THEN the Image_Lightbox SHALL allow closing by clicking the backdrop, pressing Escape, or clicking a close button
3. WHILE the lightbox is open THEN the Image_Lightbox SHALL prevent body scrolling
4. WHEN opening or closing the lightbox THEN the Image_Lightbox SHALL apply a scale and fade animation with duration of 200ms
5. WHILE the lightbox is open THEN the Image_Lightbox SHALL display the image at its natural size up to 90% of viewport dimensions

### Requirement 8

**User Story:** As a developer reader, I want to copy code blocks with one click, so that I can easily use code snippets in my projects.

#### Acceptance Criteria

1. WHEN a code block is rendered in markdown content THEN the Code_Copy_Button SHALL display a copy button in the top-right corner of the code block
2. WHEN a user clicks the copy button THEN the Code_Copy_Button SHALL copy the code content to the clipboard
3. WHEN the copy operation succeeds THEN the Code_Copy_Button SHALL display a success indicator (checkmark icon) for 2 seconds
4. IF the copy operation fails THEN the Code_Copy_Button SHALL display an error indicator and show a tooltip with the error message
5. WHEN hovering over a code block THEN the Code_Copy_Button SHALL increase the button opacity from 0.6 to 1.0
