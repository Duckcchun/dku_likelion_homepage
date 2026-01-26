import React, { useState, useEffect } from 'react'

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string
  alt: string
  placeholder?: string
  width?: number
  height?: number
  quality?: number
}

/**
 * 최적화된 이미지 컴포넌트
 * - Lazy loading으로 성능 개선
 * - WebP 포맷 자동 지원 (폴백 포함)
 * - 이미지 로드 중 placeholder 표시
 * - 로드 실패 시 graceful fallback
 */
export function OptimizedImage({
  src,
  alt,
  placeholder,
  width,
  height,
  quality = 75,
  className = '',
  ...props
}: OptimizedImageProps) {
  const [imageSrc, setImageSrc] = useState<string>(placeholder || '')
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    // 실제 이미지 URL 생성 (quality 파라미터 추가로 최적화)
    const optimizedUrl = src.includes('unsplash.com')
      ? `${src}&w=${width || 1080}&q=${quality}&fm=auto`
      : src

    const image = new Image()
    image.src = optimizedUrl
    image.onload = () => {
      setImageSrc(optimizedUrl)
      setIsLoading(false)
    }
    image.onerror = () => {
      setHasError(true)
      setIsLoading(false)
    }
  }, [src, width, quality])

  if (hasError) {
    return (
      <div
        className={`flex items-center justify-center bg-gray-200 ${className}`}
        style={{ width: width ? `${width}px` : '100%', aspectRatio: width && height ? `${width}/${height}` : 'auto' }}
      >
        <span className="text-gray-500 text-sm">이미지를 불러올 수 없습니다</span>
      </div>
    )
  }

  return (
    <img
      src={imageSrc}
      alt={alt}
      loading="lazy"
      decoding="async"
      width={width}
      height={height}
      className={`${isLoading ? 'bg-gray-200 animate-pulse' : ''} ${className}`}
      {...props}
      onLoad={() => setIsLoading(false)}
      onError={() => setHasError(true)}
    />
  )
}
