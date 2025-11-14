/**
 * Auto Scroll Speed Calculator
 * 自动根据图片数量计算和调整滚动速度
 */

document.addEventListener('DOMContentLoaded', function() {
    // 配置参数
    const config = {
        alumni: {
            baseTime: 2.5,           // 控制速度
            baseCount: null,        // 基础项目数（自动统计）
            selector: '.alumni-scroll-wrapper'
        },
        activities: {
            baseTime: 10,           // 控制速度
            baseCount: null,        // 基础项目数（自动统计）
            selector: '.activities-scroll-wrapper'
        },
        photos: {
            baseTime: 4,           // 控制速度
            baseCount: null,        // 基础项目数（自动统计）
            selector: '.photos-scroll-wrapper'
        }
    };

    /**
     * 计算动画时间
     * @param {number} baseTime - 基础时间
     * @param {number} baseCount - 基础项目数
     * @param {number} actualCount - 实际项目数
     * @returns {number} 计算后的时间
     */
    function calculateAnimationTime(baseTime, baseCount, actualCount) {
        return baseTime * (actualCount / baseCount);
    }

    /**
     * 更新滚动速度
     */
    function updateScrollSpeeds() {
        // 处理 Alumni 部分
        const alumniWrapper = document.querySelector(config.alumni.selector);
        if (alumniWrapper) {
            // 获取原始项目数
            const originalAlumniCount = alumniWrapper.querySelectorAll('.alumni-item:not(.cloned)').length;
            
            // 每张图片的间隔时间 = Time
            // 总动画时间 = 每张间隔时间 × 原始项目数
            const timePerItem = config.alumni.baseTime;
            const newAlumniTime = timePerItem * originalAlumniCount;
            
            // 更新动画
            alumniWrapper.style.animation = `scroll-left ${newAlumniTime}s linear infinite`;
            
            console.log(`Alumni: ${originalAlumniCount} items, time per item: ${timePerItem}s, total animation time: ${newAlumniTime}s`);
        }

        // 处理 Activities 部分
        const activitiesWrapper = document.querySelector(config.activities.selector);
        if (activitiesWrapper) {
            // 获取原始项目数
            const originalActivitiesCount = activitiesWrapper.querySelectorAll('.activities-item:not(.cloned)').length;
            
            // 每张图片的间隔时间 = Time
            // 总动画时间 = 每张间隔时间 × 原始项目数
            const timePerItem = config.activities.baseTime;
            const newActivitiesTime = timePerItem * originalActivitiesCount;
            
            // 更新动画
            activitiesWrapper.style.animation = `scroll-left ${newActivitiesTime}s linear infinite`;
            
            console.log(`Activities: ${originalActivitiesCount} items, time per item: ${timePerItem}s, total animation time: ${newActivitiesTime}s`);
        }

        // 处理 Photos 部分
        const photosWrapper = document.querySelector(config.photos.selector);
        if (photosWrapper) {
            // 获取原始项目数
            const originalPhotosCount = photosWrapper.querySelectorAll('.photos-item:not(.cloned)').length;
            
            // 每张图片的间隔时间 = Time
            // 总动画时间 = 每张间隔时间 × 原始项目数
            const timePerItem = config.photos.baseTime;
            const newPhotosTime = timePerItem * originalPhotosCount;
            
            // 更新动画
            photosWrapper.style.animation = `scroll-left ${newPhotosTime}s linear infinite`;
            
            console.log(`Photos: ${originalPhotosCount} items, time per item: ${timePerItem}s, total animation time: ${newPhotosTime}s`);
        }
    }

    /**
     * 克隆所有项目以实现无缝循环
     * @param {boolean} forceReset - 是否强制重置baseCount（用于动态更新）
     */
    function cloneItemsForSeamlessLoop(forceReset = false) {
        const scrollWrappers = document.querySelectorAll('.alumni-scroll-wrapper, .activities-scroll-wrapper, .photos-scroll-wrapper');
        
        scrollWrappers.forEach(wrapper => {
            // 获取所有原始项目（不包括克隆的）
            let items;
            if (wrapper.classList.contains('alumni-scroll-wrapper')) {
                items = wrapper.querySelectorAll('.alumni-item:not(.cloned)');
            } else if (wrapper.classList.contains('activities-scroll-wrapper')) {
                items = wrapper.querySelectorAll('.activities-item:not(.cloned)');
            } else if (wrapper.classList.contains('photos-scroll-wrapper')) {
                items = wrapper.querySelectorAll('.photos-item:not(.cloned)');
            }
            
            const itemsArray = Array.from(items);
            const originalCount = itemsArray.length;
            
            // 如果是动态更新，先清除旧的克隆
            if (forceReset) {
                const clonedItems = wrapper.querySelectorAll('.cloned');
                clonedItems.forEach(item => item.remove());
            }
            
            // 自动设置基础项目数（在克隆前）
            if (wrapper.classList.contains('alumni-scroll-wrapper')) {
                if (config.alumni.baseCount === null || forceReset) {
                    config.alumni.baseCount = originalCount;
                    console.log(`Alumni baseCount auto-set to: ${originalCount}`);
                }
            } else if (wrapper.classList.contains('activities-scroll-wrapper')) {
                if (config.activities.baseCount === null || forceReset) {
                    config.activities.baseCount = originalCount;
                    console.log(`Activities baseCount auto-set to: ${originalCount}`);
                }
            } else if (wrapper.classList.contains('photos-scroll-wrapper')) {
                if (config.photos.baseCount === null || forceReset) {
                    config.photos.baseCount = originalCount;
                    console.log(`Photos baseCount auto-set to: ${originalCount}`);
                }
            }
            
            // 克隆所有项目
            itemsArray.forEach(item => {
                const clone = item.cloneNode(true);
                clone.classList.add('cloned');
                wrapper.appendChild(clone);
            });
            
            // 处理动画重启
            wrapper.addEventListener('animationend', function() {
                this.style.animation = 'none';
                setTimeout(() => {
                    this.style.animation = '';
                }, 10);
            });
        });
    }

    // 执行初始化
    cloneItemsForSeamlessLoop();
    updateScrollSpeeds();

    // 监听DOM变化，自动更新速度
    const observer = new MutationObserver(function(mutations) {
        // 检查是否有新的项目被添加
        let hasChanges = false;
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length > 0) {
                hasChanges = true;
            }
        });
        
        if (hasChanges) {
            console.log('Detected changes in DOM, updating scroll speeds...');
            // 重新克隆项目（强制重置baseCount）
            cloneItemsForSeamlessLoop(true);
            // 更新速度
            updateScrollSpeeds();
        }
    });

    // 观察所有scroll wrapper的变化
    const scrollWrappers = document.querySelectorAll('.alumni-scroll-wrapper, .activities-scroll-wrapper, .photos-scroll-wrapper');
    scrollWrappers.forEach(wrapper => {
        observer.observe(wrapper, {
            childList: true,
            subtree: true
        });
    });

    // 导出函数供外部使用
    window.scrollSpeedManager = {
        updateSpeeds: updateScrollSpeeds,
        calculateTime: calculateAnimationTime,
        config: config,
        observer: observer
    };
});
