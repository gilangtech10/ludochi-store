import CheckCircleIcon from '@heroicons/react/24/solid/CheckCircleIcon';
import ExclamationTriangleIcon from '@heroicons/react/24/solid/ExclamationTriangleIcon';
import InformationCircleIcon from '@heroicons/react/24/solid/InformationCircleIcon';
import XCircleIcon from '@heroicons/react/24/solid/XCircleIcon';
import { FC, HTMLAttributes } from 'react';

import clsx from 'clsx';

export type AlertAction = FC<HTMLAttributes<HTMLButtonElement | HTMLAnchorElement>>;

const alertClassNameMap = {
  default: {
    wrapper: 'bg-[#261D19] border border-[#4A3F35]',
    icon: 'text-[#9C8B7A]',
    title: 'text-[#E8DFD4]',
    content: 'text-[rgba(232,223,212,0.7)]',
    action: 'focus:ring-offset-2 bg-[#2A201C] text-[#9C8B7A] hover:bg-[#321E17]',
  },
  success: {
    wrapper: 'bg-[#1A261A] border border-[#2D4A2D]',
    icon: 'text-[#8FBE8F]',
    title: 'text-[#B8D8B8]',
    content: 'text-[rgba(184,216,184,0.8)]',
    action: 'focus:ring-offset-2 bg-[#1A261A] text-[#8FBE8F] hover:bg-[#1E2D1E]',
  },
  error: {
    wrapper: 'bg-[#2A1717] border border-[#4A2525]',
    icon: 'text-[#C0392B]',
    title: 'text-[#E07070]',
    content: 'text-[rgba(224,112,112,0.8)]',
    action: 'focus:ring-offset-2 bg-[#2A1717] text-[#C0392B] hover:bg-[#321E1E]',
  },
  warning: {
    wrapper: 'bg-[#261E10] border border-[#4A3A1A]',
    icon: 'text-[#C9A962]',
    title: 'text-[#E8C87A]',
    content: 'text-[rgba(232,200,122,0.8)]',
    action: 'focus:ring-offset-2 bg-[#261E10] text-[#C9A962] hover:bg-[#2E2412]',
  },
  info: {
    wrapper: 'bg-[#1A1F2A] border border-[#2A3545]',
    icon: 'text-[#7BA8C9]',
    title: 'text-[#A8C8E8]',
    content: 'text-[rgba(168,200,232,0.8)]',
    action: 'focus:ring-offset-2 bg-[#1A1F2A] text-[#7BA8C9] hover:bg-[#1E2530]',
  },
};

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  type: keyof typeof alertClassNameMap;
  title?: string;
  action?: AlertAction;
  className?: string;
}

export const Alert: FC<AlertProps> = ({ type, title, action, children, className, ...props }) => {
  const iconMap = {
    default: InformationCircleIcon,
    success: CheckCircleIcon,
    error: XCircleIcon,
    warning: ExclamationTriangleIcon,
    info: InformationCircleIcon,
  };

  const Icon = iconMap[type];
  const Action = action;

  return (
    <div className={clsx('@container rounded-md p-4', className, alertClassNameMap[type].wrapper)} {...props}>
      <div className="@sm:flex-row flex flex-col">
        <div className="flex">
          <div className="flex-shrink-0">
            <Icon className={clsx('h-5 w-5', alertClassNameMap[type].icon)} aria-hidden="true" />
          </div>
          <div className="ml-3">
            {title && <h3 className={clsx('text-sm font-bold', alertClassNameMap[type].title)}>{title}</h3>}
            {children && (
              <div className={clsx('text-sm', alertClassNameMap[type].content, { 'mt-1': !!title })}>{children}</div>
            )}
          </div>
        </div>

        {Action && (
          <div className="ml-auto pl-3">
            <div className="@sm:-mb-1.5 @sm:-mt-1.5 -mx-1.5 -mb-1.5 mt-1.5">
              <Action
                className={clsx(
                  'inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2',
                  alertClassNameMap[type].action,
                )}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
