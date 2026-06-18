import os
import glob

html_files = glob.glob('d:/projects/trophy & Awards Engraving Shop Website/*.html')
for fpath in html_files:
    with open(fpath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    insert_str = '''  <div class="theme-rtl-controls mobile-theme-rtl">
    <button class="btn-theme" aria-label="Toggle Theme" title="Toggle Theme"><i class="fa-solid fa-moon"></i></button>
    <button class="btn-rtl" aria-label="Toggle RTL" title="Toggle RTL">RTL</button>
  </div>
  <div class="mobile-menu-footer">'''
    
    if '<div class="mobile-menu-footer">' in content and 'mobile-theme-rtl' not in content:
        content = content.replace('  <div class="mobile-menu-footer">', insert_str)
        with open(fpath, 'w', encoding='utf-8') as f:
            f.write(content)
        print("Updated " + os.path.basename(fpath))
