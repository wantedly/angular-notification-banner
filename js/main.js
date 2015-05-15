WantedlyAngularApp.factory("notificationBanner", [
  '$rootScope', '$compile', function($rootScope, $compile) {
    var defaultContainer, defaultTemplate;
    defaultContainer = document.body;
    defaultTemplate = "<wt-notification-banner></wt-notification-banner>";
    return {
      notify: function(args) {
        var container, message, messageTemplate, scope, template, templateElement;
        if (typeof args !== 'object') {
          args = {
            message: args
          };
        }
        container = args.container ? args.container : defaultContainer;
        template = args.template ? args.template : defaultTemplate;
        message = args.message ? args.message : "";
        messageTemplate = args.messageTemplate ? args.messageTemplate : null;
        scope = args.scope ? args.scope.$new() : $rootScope.$new();
        scope.message = message;
        scope.messageTemplate = messageTemplate;
        scope.delay = args.delay;
        if (messageTemplate) {
          template = angular.element(template).append(messageTemplate);
        }
        templateElement = $compile(template)(scope);
        angular.element(container).append(templateElement);
        return true;
      }
    };
  }
]);

WantedlyAngularApp.directive('wtNotificationBanner', [
  '$timeout', '$rootScope', function($timeout, $rootScope) {
    return {
      restrict: 'E',
      transclude: true,
      template: '<div class="wt-notification-banner"><div class="fa fa-remove"></div><div ng-show="!messageTemplate">{{ message }}</div><div ng-transclude></div></div>',
      link: function(scope, elems, attrs) {
        var ANIMATION_END_EVENT, FADEOUT_DELAY_DEFAULT, FADEOUT_DELAY_SLOW, canFadeout, cancelBannerListener, element, fadeout, fadeoutDelay, fadeoutTimer, init, startFadeoutTimer;
        FADEOUT_DELAY_DEFAULT = 5000;
        FADEOUT_DELAY_SLOW = 10000;
        ANIMATION_END_EVENT = 'mozAnimationEnd webkitAnimationEnd animationend';
        element = angular.element(elems);
        fadeoutTimer = null;
        cancelBannerListener = null;
        fadeoutDelay = FADEOUT_DELAY_DEFAULT;
        canFadeout = true;
        startFadeoutTimer = function() {
          return fadeoutTimer = $timeout(fadeout, scope.delay || fadeoutDelay);
        };
        fadeout = function() {
          cancelBannerListener();
          $timeout.cancel(fadeoutTimer);
          element.removeClass("animated fadeInRightBig");
          element.addClass("animated fadeOutUpBig");
          return element.on(ANIMATION_END_EVENT, function() {
            return element.remove();
          });
        };
        scope.remove = function() {
          fadeout();
          return true;
        };
        element.on('mouseenter', function() {
          return $timeout.cancel(fadeoutTimer);
        });
        element.on('mouseleave', function() {
          if (canFadeout) {
            return startFadeoutTimer();
          }
        });
        element.on('click', function(e) {
          var ref;
          if ((ref = e.target.nodeName.toLowerCase()) === "textarea" || ref === "input") {
            canFadeout = false;
            $timeout.cancel(fadeoutTimer);
          }
          if (e.target.nodeName.toLowerCase() === "a") {
            startFadeoutTimer();
          }
          return true;
        });
        scope.$on("wt-notification-banner:cancel", function() {
          return startFadeoutTimer();
        });
        init = function() {
          $rootScope.$emit("wt-notification-banner:open");
          cancelBannerListener = $rootScope.$on("wt-notification-banner:open", function() {
            return fadeout();
          });
          element.addClass("animated fadeInRightBig");
          return startFadeoutTimer();
        };
        return init();
      }
    };
  }
]);