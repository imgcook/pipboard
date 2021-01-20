import * as log from '~/common/log';

(function(){
  log.other('webcamImageClassification', {flow_type: 'page_loading_start'});
  window.onload = function(){
    log.other('webcamImageClassification', {flow_type: 'page_loading_end'});
  };
})();
