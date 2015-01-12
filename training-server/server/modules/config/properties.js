'use strict';

exports.ravelloUrl = 'https://cloud.ravellosystems.com';

exports.baseUrl = '/services';

exports.defaultAutoStopSeconds = 60 * 60 * 2;

exports.dateFormat = 'dd.MM.yyyy hh:mm:ss tt';

// The default publish method.
// Can be one of: [COST_OPTIMIZED, PERFORMANCE_OPTIMIZED]
exports.defaultOptimizationLevel = 'PERFORMANCE_OPTIMIZED';

// The default cloud to use, when publish method is PERFORMANCE_OPTIMIZED.
// Can be one of: [AMAZON, HPCLOUD, GOOGLE]
exports.defaultCloud = 'AMAZON';

// The default region to use, when publish method is PERFORMANCE_OPTIMIZED.
// Can be one of: [Virginia, Oregon (for Amazon), US West AZ 2 (for HP), us-central1 (for Google Cloud)]
exports.defaultRegion = 'Virginia';
