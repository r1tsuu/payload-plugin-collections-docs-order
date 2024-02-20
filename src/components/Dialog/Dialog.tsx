import * as RadixDialog from '@radix-ui/react-dialog'
import clsx from 'clsx'
import Close from 'payload/dist/admin/components/icons/CloseMenu'
import type { ReactNode } from 'react'
import React from 'react'

type Props = {
  className?: string
  trigger?: ReactNode
} & RadixDialog.DialogProps

export const Dialog = ({ children, className, trigger, ...dialogProps }: Props) => {
  return (
    <RadixDialog.Root {...dialogProps}>
      {trigger && <RadixDialog.Trigger asChild>{trigger}</RadixDialog.Trigger>}
      <RadixDialog.Portal>
        <RadixDialog.Overlay asChild>
          <div className={clsx('dialog-overlay', className)}>
            <RadixDialog.Content asChild>
              <div className={'dialog-content'}>
                <RadixDialog.Close className="close">
                  <Close />
                </RadixDialog.Close>
                {children}
              </div>
            </RadixDialog.Content>
          </div>
        </RadixDialog.Overlay>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  )
}
