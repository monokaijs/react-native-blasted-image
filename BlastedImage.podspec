require 'json'

package = JSON.parse(File.read(File.join(__dir__, 'package.json')))
fabric_enabled = ENV['RCT_NEW_ARCH_ENABLED'] == '1'

Pod::Spec.new do |s|
  s.name         = "BlastedImage"
  s.version      = package['version']
  s.summary      = package['description']
  s.description  = <<-DESC
                  BlastedImage provides advanced image loading and caching capabilities for React Native projects, leveraging the power of SDWebImage.
                  DESC
  s.homepage     = "https://github.com/xerdnu/react-native-blasted-image"
  s.license      = "MIT"
  s.author       = { "author" => "xerdnu@gmail.com" }
  s.platform     = :ios, "11.0"
  s.source       = { :git => "https://github.com/xerdnu/react-native-blasted-image.git", :tag => s.version.to_s }
  s.source_files = "ios/*.{h,m}"
  s.requires_arc = true

  s.dependency "SDWebImage"
  s.dependency "SDWebImageSVGCoder"
  s.dependency 'SDWebImageAVIFCoder'

  if fabric_enabled
    s.dependency "React-RCTFabric"
    s.dependency "React-Codegen"
    s.dependency "RCT-Folly"
    s.dependency "RCTRequired"
    s.dependency "RCTTypeSafety"
    s.dependency "ReactCommon/turbomodule/core"
  else
    s.dependency "React-Core"
  end

end
