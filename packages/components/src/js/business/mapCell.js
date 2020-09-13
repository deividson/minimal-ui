const CELL_FEATURE_ATTR = {
  COLOR: {
    name: 'COLOR',
    prefix: 'color',
    values: ['primary', 'secondary', 'primary-light'],
  },
  BKG_COLOR: {
    name: 'BKG_COLOR',
    prefix: 'bkg-color',
    values: ['primary', 'secondary', 'primary-light'],
  },
  ANIMATION: {
    name: 'ANIMATION',
    prefix: 'anim',
    values: ['loading'],
  },
  SHAPE: {
    name: 'SHAPE',
    prefix: 'shape',
    values: ['square', 'circle'],
  },
  VISIBILITY: {
    name: 'VISIBILITY',
    prefix: 'visibility',
    values: ['hidden', 'visible'],
  },
}

const CELL_FEATURE_CONTAINERS = {
  // BACKGROUND: {
  //   name: 'BACKGROUND',
  //   prefix: 'bkg',
  //   classContainer: 'background',
  // },
  BOX: {
    name: 'BOX',
    prefix: 'box',
    classContainer: 'box',
  },
  CONTENT: {
    name: 'CONTENT',
    prefix: 'ctt',
    classContainer: 'content',
  },
  ICON: {
    name: 'ICON',
    prefix: 'ico',
    classContainer: 'icon',
  },
}

const toFeature = (container, attribute, value) => ({
  container, attribute, value,
})

const featureToClass = (feat) => {
  const containerPrefix = CELL_FEATURE_CONTAINERS[feat.container].prefix
  const attrPrefix = CELL_FEATURE_ATTR[feat.attribute].prefix

  return `${containerPrefix}-${attrPrefix}--${feat.value}`
}

const behaviorToFeatureClass = (containersClass, behaviorList = []) => {
  behaviorList.forEach((behavior) => {
    behavior.featureEffects.forEach((featEffect) => {
      if (featEffect.isOn) {
        featEffect.features.forEach((feature) => {
          const featClass = featureToClass(feature)
          containersClass[feature.container].push(featClass)
        })
      } else {
        // aplica default
      }
    })
  })
}

export {
  toFeature,
  featureToClass,
  behaviorToFeatureClass,
}
