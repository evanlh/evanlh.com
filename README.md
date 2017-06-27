# Setup the machine
1. https://www.linode.com/docs/getting-started#deploying-an-image
1. https://www.linode.com/docs/security/securing-your-server
1. https://help.ubuntu.com/lts/serverguide/automatic-updates.html
  + todo: email
1. https://www.linode.com/docs/security/using-fail2ban-for-security
  + todo: configure
1. Save this as an image!

# Setup ansible
1. ```brew install ansible```
1. ```cp ansible_hosts ~/```
1. ```echo 'export ANSIBLE_INVENTORY=~/ansible_hosts' >> ~/.zshrc```
1. ```ansible-playbook ./playbook/setup.yml --ask-sudo-pass```

